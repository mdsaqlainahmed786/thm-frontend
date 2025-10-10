import ComingSoon from "@/components/CommingSoon";
import Landing from "./(main-app)/landing/Lading";
import { Metadata } from "next";
import SmoothScroll from "./(main-app)/landing/SmoothScroll";
export const metadata: Metadata = {
  title: "The Hotel Media",
  description: "Discover and share the best hotels, restaurants, bars, and nightclubs with The Hotel Media, the ultimate social platform for travelers and nightlife enthusiasts. Whether you're looking for a luxurious hotel, a cozy café, a lively bar, or the hottest nightclub in town, our app helps you connect with like-minded people and explore top-rated venues worldwide.",
};
export default function Home() {
  return (
    // <SmoothScroll>
    <Landing />
    // </SmoothScroll>
    // <ComingSoon />
  );
}
