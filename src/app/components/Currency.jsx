export default function Currency({amount}) {
   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: amount % 1 !== 0 ? 2 : 0,
   }).format(amount);
}