export const dutcheyyRadio = {
  name: "Dutcheyy Radio",
  slogan: "Independent. Global. Future focused.",
  format: "EDM / electronic / dark driving",
  territory: "United Kingdom (web stream)",
  submissionFeeGbp: 29,
  mechanicalPerSpinGbp: 0.12,
  performanceReserveGbp: 0.04,
  notes:
    "This desk is a web radio + accounting layer. A live FM/DAB service still needs Ofcom (if broadcast) plus PRS for Music (MCPS mechanicals + performing) and PPL (sound recordings). Submission fees are station income. Mechanicals on Dutcheyy-owned catalogue are publisher income; on outside submissions they are a clearance line billed to the artist.",
};

export function gbp(n: number) {
  return `£${n.toFixed(2)}`;
}
