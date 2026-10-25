GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tour_dates TO authenticated;
GRANT SELECT ON public.tour_dates TO anon;
GRANT ALL ON public.tour_dates TO service_role;
DROP POLICY IF EXISTS "Admin can read all tour dates" ON public.tour_dates;
CREATE POLICY "Admin can read all tour dates" ON public.tour_dates FOR SELECT TO authenticated
USING ((SELECT public.has_role((SELECT auth.uid()), 'admin'::public.app_role)));