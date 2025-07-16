import { useEffect, useState } from 'react';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface DataFetcherOutput {
  data: OpenMeteoResponse | null;
  loading: boolean;
  error: string | null;
}

interface CacheEntry {
  timestamp: number; // milliseconds since epoch
  data: OpenMeteoResponse;
}

// Tiempo de vida del caché en minutos
const CACHE_TTL_MINUTES = 10;

// Prefijo para las claves en localStorage
const STORAGE_PREFIX = 'openMeteoCache';

const cityCoords: Record<string, { latitude: number; longitude: number }> = {
  guayaquil: { latitude: -2.17, longitude: -79.92 },
  quito: { latitude: -0.22, longitude: -78.52 },
  manta: { latitude: -0.95, longitude: -80.67 },
  cuenca: { latitude: -2.90, longitude: -78.99 },
};

export default function DataFetcher(city: string): DataFetcherOutput {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setData(null);

    const cacheKey = `${STORAGE_PREFIX}:${city}`;

    const getCached = (): CacheEntry | null => {
      try {
        const raw = localStorage.getItem(cacheKey);
        if (!raw) return null;
        const entry: CacheEntry = JSON.parse(raw);
        return entry;
      } catch {
        return null;
      }
    };

    // Guarda en caché
    const setCached = (entry: CacheEntry) => {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(entry));
      } catch {
        // Ignorar errores de almacenamiento
      }
    };

    const isFresh = (entry: CacheEntry): boolean => {
      const ageMs = Date.now() - entry.timestamp;
      return ageMs < CACHE_TTL_MINUTES * 60 * 1000;
    };

    const fetchData = async () => {
      const coords = cityCoords[city] || cityCoords.guayaquil;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}` +
        `&longitude=${coords.longitude}` +
        `&hourly=temperature_2m,wind_speed_10m` +
        `&current=apparent_temperature,wind_speed_10m,relative_humidity_2m,temperature_2m` +
        `&timezone=America%2FChicago`;

      const cached = getCached();
      if (cached && isFresh(cached)) {
        // Usar datos en caché y evitar petición
        if (!isMounted) return;
        setData(cached.data);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const result: OpenMeteoResponse = await response.json();
        if (!isMounted) return;
        setData(result);
        // Guardar en caché con timestamp actual
        setCached({ timestamp: Date.now(), data: result });
      } catch (err: any) {
        // En caso de error, intentar usar caché aunque esté expirado
        if (cached) {
          if (!isMounted) return;
          setData(cached.data);
          setError('Error al obtener datos; mostrando información en caché.');
        } else {
          const msg = err instanceof Error ? err.message : 'Ocurrió un error desconocido al obtener los datos.';
          if (!isMounted) return;
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [city]);
  return { data, loading, error };
}
