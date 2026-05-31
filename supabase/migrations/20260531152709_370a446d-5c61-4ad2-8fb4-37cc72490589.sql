
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, username, name, age, gender, height_cm, weight_kg,
    goal, workout_level, activity_level, workout_place
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.id::text),
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE((NEW.raw_user_meta_data->>'age')::int, 0),
    COALESCE(NEW.raw_user_meta_data->>'gender', ''),
    COALESCE((NEW.raw_user_meta_data->>'height_cm')::numeric, 0),
    COALESCE((NEW.raw_user_meta_data->>'weight_kg')::numeric, 0),
    COALESCE(NEW.raw_user_meta_data->>'goal', ''),
    COALESCE(NEW.raw_user_meta_data->>'workout_level', ''),
    COALESCE(NEW.raw_user_meta_data->>'activity_level', ''),
    COALESCE(NEW.raw_user_meta_data->>'workout_place', 'home')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
