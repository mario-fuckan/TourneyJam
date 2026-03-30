import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
	"https://aspyjpxfbvhwbpseezob.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcHlqcHhmYnZod2Jwc2Vlem9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODgxNzcsImV4cCI6MjA3MDY2NDE3N30.VOj-xioISYfRhbPNLv1M6Ot3kxr561d72tkMni5Gj6Y"
)
