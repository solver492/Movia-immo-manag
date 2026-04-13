import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Property, PropertyFilters, PropertyFormData } from '../types/property';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async (filters?: PropertyFilters) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.type) query = query.eq('type', filters.type);
      if (filters?.transaction) query = query.eq('transaction', filters.transaction);
      if (filters?.statut_mandat) query = query.eq('statut_mandat', filters.statut_mandat);
      if (filters?.localisation)
        query = query.ilike('localisation', `%${filters.localisation}%`);
      if (filters?.prix_min) query = query.gte('prix', parseFloat(filters.prix_min));
      if (filters?.prix_max) query = query.lte('prix', parseFloat(filters.prix_max));

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setProperties(data as Property[]);
    } catch (err) {
      setError('Erreur lors du chargement des biens.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const addProperty = async (formData: PropertyFormData): Promise<boolean> => {
    try {
      const payload = {
        type: formData.type,
        transaction: formData.transaction,
        prix: parseFloat(formData.prix) || 0,
        superficie: parseFloat(formData.superficie) || 0,
        nb_chambres: formData.nb_chambres ? parseInt(formData.nb_chambres) : null,
        parking: formData.parking,
        etage: formData.etage ? parseInt(formData.etage) : null,
        ascenseur: formData.ascenseur,
        etat: formData.etat || null,
        localisation: formData.localisation,
        contact_nom: formData.contact_nom,
        contact_telephone: formData.contact_telephone,
        statut_mandat: formData.statut_mandat,
        photo_url: formData.photo_url || null,
      };
      const { error: insertError } = await supabase.from('properties').insert([payload]);
      if (insertError) throw insertError;
      await fetchProperties();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateProperty = async (
    id: string,
    formData: Partial<PropertyFormData>
  ): Promise<boolean> => {
    try {
      const payload: Record<string, unknown> = {};
      if (formData.type !== undefined) payload.type = formData.type;
      if (formData.transaction !== undefined) payload.transaction = formData.transaction;
      if (formData.prix !== undefined) payload.prix = parseFloat(formData.prix) || 0;
      if (formData.superficie !== undefined)
        payload.superficie = parseFloat(formData.superficie) || 0;
      if (formData.nb_chambres !== undefined)
        payload.nb_chambres = formData.nb_chambres ? parseInt(formData.nb_chambres) : null;
      if (formData.parking !== undefined) payload.parking = formData.parking;
      if (formData.etage !== undefined)
        payload.etage = formData.etage ? parseInt(formData.etage) : null;
      if (formData.ascenseur !== undefined) payload.ascenseur = formData.ascenseur;
      if (formData.etat !== undefined) payload.etat = formData.etat || null;
      if (formData.localisation !== undefined) payload.localisation = formData.localisation;
      if (formData.contact_nom !== undefined) payload.contact_nom = formData.contact_nom;
      if (formData.contact_telephone !== undefined)
        payload.contact_telephone = formData.contact_telephone;
      if (formData.statut_mandat !== undefined) payload.statut_mandat = formData.statut_mandat;
      if (formData.photo_url !== undefined) payload.photo_url = formData.photo_url || null;

      const { error: updateError } = await supabase
        .from('properties')
        .update(payload)
        .eq('id', id);
      if (updateError) throw updateError;
      await fetchProperties();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteProperty = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;
      setProperties((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return {
    properties,
    loading,
    error,
    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty,
  };
}
