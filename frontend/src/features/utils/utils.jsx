function capitalizeFirst(str, guion = false) {
    if (!str) return '';

    if (guion) {
      str = str.replace(/_/g, ' ');
    }
  
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
  export default capitalizeFirst;
  