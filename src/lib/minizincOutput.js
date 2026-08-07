export const miniZincStatusLines = {
    ALL_SOLUTIONS: '==========',
    OPTIMAL_SOLUTION: '==========',
    UNSATISFIABLE: '=====UNSATISFIABLE=====',
    UNSAT_OR_UNBOUNDED: '=====UNSATorUNBOUNDED=====',
    UNBOUNDED: '=====UNBOUNDED=====',
    UNKNOWN: '=====UNKNOWN=====',
    ERROR: '=====ERROR=====',
};

/** @param {string} status */
export function formatMiniZincStatus(status) {
    return miniZincStatusLines[status] || '';
}
