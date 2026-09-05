export function authHeader() {
    let checker = JSON.parse(localStorage.getItem('checker'));

    if (checker && checker.token) {
        return { 'Authorization': checker.token };
    } else {
        return {};
    }
}