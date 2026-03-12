const serviceTicketTransitions = {
  submitted: ["processing", "closed"],
  processing: ["resolved", "closed"],
  resolved: ["closed"],
  closed: []
};

function canServiceTicketTransition(from, to) {
  return Boolean(serviceTicketTransitions[from] && serviceTicketTransitions[from].includes(to));
}

module.exports = {
  serviceTicketTransitions,
  canServiceTicketTransition
};
