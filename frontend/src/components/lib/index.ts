export const numberFormat = (value: any) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "PEN",
  }).format(value);
