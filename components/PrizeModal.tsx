import React, { useEffect, useState, useRef } from "react";
import { Prize } from "../types";
import html2canvas from "html2canvas";

interface PrizeModalProps {
  prize: Prize;
  fortune: string | null;
  onClose: () => void;
}

/**
 * Mapping HADIAH -> FILE PNG KHUSUS (untuk download).
 * Pastikan file-file ini ada di: public/vouchers/
 */
const voucherImageMap: Record<string, string> = {
  "1000K": "/vouchers/voucher-1000k.png",
  "900K": "/vouchers/voucher-900k.png",
  "800K": "/vouchers/voucher-800k.png",
  "750K": "/vouchers/voucher-750k.png",
  "700K": "/vouchers/voucher-700k.png",
  "600K": "/vouchers/voucher-600k.png",
  "500K": "/vouchers/voucher-500k.png",
};

export const PrizeModal: React.FC<PrizeModalProps> = ({
  prize,
  fortune,
  onClose,
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsRendered(true), 50);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Ambil teks hadiah yang bersih supaya cocok dengan key map.
   * Misal: "1000K Voucher" -> "1000K"
   */
  const getPrizeKey = (): string => {
    const raw =
      typeof prize === "string"
        ? prize
        : (prize as any)?.label || (prize as any)?.value || (prize as any)?.name;

    return String(raw)
      .toUpperCase()
      .replace("VOUCHER", "")
      .replace(/\s+/g, "")
      .trim();
  };

  /**
   * DOWNLOAD versi mewah: ambil PNG statis dari public/vouchers
   * (ini yang kamu mau: ukuran kecil, elegan, bukan screenshot UI).
   */
  const downloadVoucherImage = () => {
    const prizeKey = getPrizeKey();
    const imageUrl = voucherImageMap[prizeKey];

    if (!imageUrl) {
      alert(
        `Voucher image tidak ditemukan untuk hadiah: "${prizeKey}".\nCek voucherImageMap dan nama file di public/vouchers`
      );
      return;
    }

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `Giorgio-Armani-Voucher-${prizeKey}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * FUNGSI LAMA (screenshot UI) - boleh dibiarkan, tapi tombol tidak pakai ini lagi.
   * Kalau kamu ingin, nanti bisa hapus agar file lebih clean.
   */
  const downloadVoucherPNG = async () => {
    if (!exportRef.current || isDownloading) return;

    try {
      setIsDownloading(true);

      if ((document as any).fonts) {
        await (document as any).fonts.ready;
      }

      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: "#0B0A16",
        scale: 3,
        useCORS: true,
        logging: false,
        width: 960,
        height: 640,
        removeContainer: true,
      });

      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Giorgio-Armani-Voucher-${getPrizeKey()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      alert("Gagal download PNG (screenshot).");
    } finally {
      setIsDownloading(false);
    }
  };

  // ====== UI kamu (biarkan sesuai aslinya) ======
  // Aku tidak bisa lihat JSX lengkap dari screenshot,
  // jadi di bawah ini aku tulis kerangka minimal.
  // Kamu GANTI bagian return ini dengan return JSX asli kamu,
  // tapi yang penting: tombol unduh pakai downloadVoucherImage.

  return (
    <div className="prize-modal">
      {/* konten modal kamu */}
      <div>
        <button onClick={downloadVoucherImage} disabled={isDownloading}>
          UNDUH VOUCHER
        </button>

        <button onClick={onClose}>TUTUP</button>
      </div>

      {/* Elemen yang dipakai fungsi screenshot lama */}
      <div
        ref={exportRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        {/* isi kartu invisible lama kamu (kalau masih dipakai screenshot) */}
      </div>
    </div>
  );
};
