export function convert(date){
    const options = { hour:'numeric', minute:'numeric' ,weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString("en-US", options);
}
