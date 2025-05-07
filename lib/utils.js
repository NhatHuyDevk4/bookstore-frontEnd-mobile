
export function formatMemberSince(dataString) {
    const data = new Date(dataString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const month = data.toLocaleDateString("default", { month: "short" });
    const year = data.getFullYear();
    return `${month}, ${year}`;
}

export function formatPublishedDate(dataString) {
    const data = new Date(dataString);
    const month = data.toLocaleDateString("default", { month: "long" });
    const year = data.getFullYear();
    const day = data.getDate();
    return `${month} ${day} ${year}`;
}