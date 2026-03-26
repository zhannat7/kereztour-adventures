import { Mail, Phone, MessageCircle, Facebook, Instagram, ArrowUpRight } from "lucide-react";

const Footer = () => (
  <footer id="kontakt" className="bg-primary text-primary-foreground relative overflow-hidden">
    {/* Top decorative bar */}
    <div className="h-1 bg-gradient-to-r from-secondary via-secondary/60 to-transparent" />

    <div className="container mx-auto px-6 py-16 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        {/* Brand */}
        <div className="md:col-span-5">
          <h3 className="font-display text-3xl md:text-4xl mb-4">Kereztour</h3>
          <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-sm">
            Dein Tor zu unvergesslichen Abenteuern in Kirgisistan – seit 2025 bringen wir
            Reisende zu den schönsten Orten Zentralasiens.
          </p>
        </div>

        {/* Contact */}
        <div className="md:col-span-3">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/40 mb-6">Kontakt</h4>
          <ul className="space-y-4 text-sm">
            <li>
              <a href="mailto:sarinasadirovna@gmail.com" className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors group">
                <Mail className="h-4 w-4 shrink-0" />
                <span>sarinasadirovna@gmail.com</span>
              </a>
            </li>
            <li>
              <a href="tel:+393474867408" className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+39 347 486 7408</span>
              </a>
            </li>
            <li>
              <a href="https://wa.me/393474867408" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors">
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>Schreib uns auf WhatsApp</span>
                <ArrowUpRight className="h-3 w-3 opacity-50" />
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div className="md:col-span-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/40 mb-6">Folge uns</h4>
          <ul className="space-y-4 text-sm">
            <li>
              <a href="https://www.facebook.com/profile.php?id=61580882909583" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors">
                <Facebook className="h-4 w-4 shrink-0" />
                <span>Folge uns auf Facebook</span>
                <ArrowUpRight className="h-3 w-3 opacity-50" />
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/sarinamam88/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors">
                <Instagram className="h-4 w-4 shrink-0" />
                <span>Folge uns auf Instagram</span>
                <ArrowUpRight className="h-3 w-3 opacity-50" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/30">
        © 2025 Kereztour – Alle Rechte vorbehalten
      </div>
    </div>
  </footer>
);

export default Footer;
