// não confundir com "sliceNickname", format corta o nickname com base no primeiro nome
export default function format_nickname(nickname, max = 15) {
  if (!nickname) return "...";

  const firstName = nickname.split(" ")[0];

  return firstName.length > max ? firstName.slice(0, max) + "…" : firstName;
}
