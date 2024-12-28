import moment from 'moment-timezone';

export function formatDateToBerlinDDMMYYYYHHmm(dateString) {
  // Parse the datetime string and convert it to Berlin's time zone
  const berlinTime = moment(dateString).tz('Europe/Berlin');

  // Format it in 'DD-MM-YYYY: HH:mm' format
  return berlinTime.format('DD-MM-YYYY: HH:mm');
}

export function formatDateToBerlinDDMMYYYY(dateString) {
    // Parse the datetime string and convert it to Berlin's time zone
    const berlinTime = moment(dateString).tz('Europe/Berlin');
    
    // Format it in 'DD-MM-YYYY' format
    return berlinTime.format('DD-MM-YYYY');
  }

  export function formatDateToBerlinHHmm(dateString) {
    console.log("formatDateToBerlinHHmm", dateString);
    
    // Parse the datetime string and convert it to Berlin's time zone
    const berlinTime = moment(dateString).tz('Europe/Berlin');
  
    // Format it in 'DD-MM-YYYY' format
    return berlinTime.format('HH:mm');
}
