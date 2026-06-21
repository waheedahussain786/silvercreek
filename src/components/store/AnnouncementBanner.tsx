import { createClient } from "@/lib/supabase/server";

export default async function AnnouncementBanner() {
  const supabase = await createClient();
  const { data } = await supabase.from("store_settings").select("store_announcement").single();
  if (!data?.store_announcement) return null;

  return (
    <div className="bg-[#3D4A1E] text-white text-center py-2.5 px-4 text-xs font-medium tracking-wide">
      {data.store_announcement}
    </div>
  );
}
