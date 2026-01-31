// Gemini service DISABLED (free mode, no billing)

export async function getFortuneMessage(prizeLabel: string): Promise<string> {
  return `Selamat atas pencapaian istimewa Anda meraih Armani Voucher senilai ${prizeLabel}. 
  Ini adalah bentuk apresiasi eksklusif dari Giorgio Armani.`;
}
