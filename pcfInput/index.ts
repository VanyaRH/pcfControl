import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class PCFInputControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _value: string;
    private _notifyOutputChanged: () => void;
    private inputElement: HTMLInputElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _refreshData: EventListenerOrEventListenerObject;

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
       this._context = context;
       this._notifyOutputChanged = notifyOutputChanged;
       this._refreshData = this.refreshData.bind(this);
 
       this.inputElement = document.createElement("input");
       this.inputElement.setAttribute("type", "text");
       this.inputElement.addEventListener("input", this._refreshData);

       this.inputElement.setAttribute("class", "custom-input");
       this.inputElement.setAttribute("id", "account-name");
 
       this._value = context.parameters.controlValue.raw!;
       this.inputElement.setAttribute("value", context.parameters.controlValue.formatted ? context.parameters.controlValue.formatted : "");
 
       container.appendChild(this.inputElement);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
       this._value = context.parameters.controlValue.raw!;
       this._context = context;
       this.inputElement.setAttribute("value", context.parameters.controlValue.formatted ? context.parameters.controlValue.formatted : "");
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as ???bound??? or ???output???
     */
    public getOutputs(): IOutputs
    {
        return {
            controlValue: this._value
         };
    }

    public _setValidate(evt: Event):void{
        this.inputElement.value = this.inputElement.value.replace(/\d/g, "");
    }

    public refreshData(evt: Event): void {
        this._setValidate(evt);
        this._value = (this.inputElement.value as any) as string;
        this._notifyOutputChanged();
     }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        this.inputElement.removeEventListener("input", this._refreshData);
    }
}
