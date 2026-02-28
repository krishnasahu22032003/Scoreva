import About from "@/components/About";
import Features from "@/components/Features";
import Header from "@/components/Header";
import Hero from "@/components/Hero";


export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
    <Header/>
    <Hero/>
    <Features/>
    <About/>
    </main>
  );
} 