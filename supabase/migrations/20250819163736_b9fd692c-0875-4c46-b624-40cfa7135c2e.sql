-- Remove the public read policy for choferes table to protect sensitive personal information
DROP POLICY IF EXISTS "Anyone can view choferes" ON public.choferes;

-- The existing "Admins can manage choferes" policy already allows admins to read the data
-- No additional policy needed since only admins should access sensitive driver information