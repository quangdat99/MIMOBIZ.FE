var APIConfig = {
    development: 'https://localhost:7195',
    // development: 'https://mimobiz-g9abeefaaed9c5a8.japanwest-01.azurewebsites.net',
    // development: 'https://mimobiz-web-api.onrender.com',
    // development: 'https://mimobiz-web-acfqfddddce6age9.indonesiacentral-01.azurewebsites.net',
    domain: 'local:7195/'
}

export default APIConfig[import.meta.env?.MODE || process.env?.NODE_ENV || 'development'] || APIConfig.development;
