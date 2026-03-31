-- Temporary cleanup: remove noisy Santa Clara traffic from visits dashboard data.
delete from public.visit_events
where country = 'United States'
  and region = 'California'
  and city = 'Santa Clara';
