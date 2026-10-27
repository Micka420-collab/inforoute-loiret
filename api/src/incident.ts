import { z } from 'zod';

export const IncidentType = z.enum(['accident', 'travaux', 'circulation', 'meteo', 'danger', 'autre']);
export const Severity = z.enum(['low', 'medium', 'high']);
export const Source = z.enum(['bison-fute', 'meteo-france', 'vigicrues', 'community']);

export const IncidentSchema = z.object({
  id: z.string(),
  type: IncidentType,
  severity: Severity,
  source: Source,
  verified: z.boolean(),
  road: z.string().optional(), // ex: A10, N20
  title: z.string(),
  description: z.string().optional(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
});

export type Incident = z.infer<typeof IncidentSchema>;
