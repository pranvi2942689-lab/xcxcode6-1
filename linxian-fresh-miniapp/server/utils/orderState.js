const orderTransitions = {
  pending_payment: ["pending_delivery", "cancelled"],
  pending_delivery: ["delivering", "cancelled", "refunding"],
  delivering: ["completed", "refunding"],
  completed: ["refunding"],
  cancelled: [],
  refunding: ["completed", "cancelled"]
};

function canOrderTransition(from, to) {
  return Boolean(orderTransitions[from] && orderTransitions[from].includes(to));
}

module.exports = {
  orderTransitions,
  canOrderTransition
};
