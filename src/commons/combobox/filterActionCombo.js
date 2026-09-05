export const useFilterActionCombo = () => {

  function exxtendFilter(filters, extended) {
    let filterObject =
      JSON.parse(filters && filters.length > 0 ? filters : null) || [];
    if (extended && extended.length > 0) {
      extended.forEach(x => {
        if (!filterObject.find(y => y.Field == x.Field &&
          JSON.stringify(y.Value) == JSON.stringify(x.Value) &&
          y.Operator === x.Operator)) {
          filterObject.push(x);
        }
      });
    }

    return JSON.stringify(filterObject);
  }

  return {
    exxtendFilter
  }
}