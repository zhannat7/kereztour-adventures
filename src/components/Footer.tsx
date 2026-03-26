import { Mail, Phone, MessageCircle, Facebook, Instagram } from "lucide-react";

const Footer = () => (
  <footer id="kontakt" className="bg-primary text-primary-foreground py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <h3 className="font-display text-2xl font-bold mb-4">Kereztour</h3>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            Dein Tor zu unvergesslichen Abenteuern in Kirgisistan.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Kontakt</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="mailto:sarinasadirovna@gmail.com" className="flex items-center gap-2 hover:underline">
                <Mail className="h-4 w-4" /> sarinasadirovna@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+393474867408" className="flex items-center gap-2 hover:underline">
                <Phone className="h-4 w-4" /> +39 347 486 7408
              </a>
            </li>
            <li>
              <a href="https://wa.me/393474867408" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                <MessageCircle className="h-4 w-4" /> Schreib uns auf WhatsApp
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Folge uns</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="https://www.facebook.com/profile.php?id=61580882909583" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                <Facebook className="h-4 w-4" /> Folge uns auf Facebook
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/sarinamam88/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                <Instagram className="h-4 w-4" /> Folge uns auf Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-primary-foreground/20 pt-6 text-center text-xs text-primary-foreground/50">
        © 2025 Kereztour – Alle Rechte vorbehalten
      </div>
    </div>
  </footer>
);

export default Footer;
