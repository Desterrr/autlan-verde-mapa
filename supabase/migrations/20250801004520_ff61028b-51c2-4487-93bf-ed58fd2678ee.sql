-- Assign admin role to the current user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('c1d432fc-4876-4df5-8b76-e276736c7411', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;