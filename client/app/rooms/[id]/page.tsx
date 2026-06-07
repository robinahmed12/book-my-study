import type { Metadata } from "next";
import { RoomDetailClient } from "@/components/rooms/RoomDetailClient";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${params.id}`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    if (data.success) {
      return {
        title: data.room.roomName,
        description: data.room.description,
        openGraph: {
          title: data.room.roomName,
          description: data.room.description,
          images: [data.room.image],
        },
      };
    }
  } catch {}
  return { title: "Room Details" };
}

export default function RoomDetailPage({ params }: PageProps) {
  return <RoomDetailClient id={params.id} />;
}
