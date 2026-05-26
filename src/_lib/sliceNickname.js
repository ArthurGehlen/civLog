// não confundir com "formatNickname", o slice não corta o nickname com base no primeiro nome mas sim com um máximo de caracteres (padrão 15)
export default function slice_nickname(nickname) {
  if (!nickname) return "...";

  return nickname.length > 15 ? nickname.slice(0, 15) + "…" : nickname;
}
