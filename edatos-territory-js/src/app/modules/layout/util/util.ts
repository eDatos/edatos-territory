export function appendContextualFragment(html: string, id: string) {
  const element = document.getElementById(id);
  element?.appendChild(document.createRange().createContextualFragment(html));
  return element;
}
