import React from 'react';
// this component will display just a single field
function Field({ value }) {
  return <button disabled={!!value}>{value}</button>;
}

export default Field;
