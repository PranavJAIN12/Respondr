
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bynbpzgypyabmnerzhsb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bmJwemd5cHlhYm1uZXJ6aHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5MTI0ODMsImV4cCI6MjA0MDQ4ODQ4M30.r46iNd_YHGBsRV6JQCiNV44_Y6SXKSetAQgOSAGoTpE'
export const supabase = createClient(supabaseUrl, supabaseKey)