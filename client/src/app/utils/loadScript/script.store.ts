export interface Scripts {
   name: string;
   type: string
   url: string;
}
export const ScriptStore: Scripts[] = [
   {name: 'adyenJS', type: "script", url: 'https://checkoutshopper-live.adyen.com/checkoutshopper/sdk/VERSION/adyen.js'},
   {name: 'adyenCSS', type: "link", url: 'https://checkoutshopper-live.adyen.com/checkoutshopper/sdk/VERSION/adyen.css'}
];