// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://aasvhbsqqyoyvistugbo.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhc3ZoYnNxcXlveXZpc3R1Z2JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2MjI4NjAsImV4cCI6MjAzMjE5ODg2MH0.Jn2xDHi8UAyWWNlAt_2JhXKbKy4V3onNGRRr6B2QUwg"

export const supabase = createClient(supabaseUrl, supabaseKey);
