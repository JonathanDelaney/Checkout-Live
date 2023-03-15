import {
   AfterViewInit,
   Component, EventEmitter,
   Input,
   OnInit, Output, SimpleChanges,
   ViewChild
} from "@angular/core";
import {ControlValueAccessor} from "@angular/forms";
import * as CodeMirror from "codemirror";

export type CodeEditorMode = "typescript" | "javascript" | "json";

@Component({
   selector: "app-code-editor",
   template: `<textarea #editorHolder></textarea>`,
   styleUrls: ['./themes/darcula.css']

})
export class CodeEditorComponent
   implements AfterViewInit, ControlValueAccessor {
   @ViewChild("editorHolder", {static: true})
   editorHolder: any;

   @Input()
   mode: CodeEditorMode;

   @Input()
   lineNumbers: boolean = false;

   @Input()
   readonly: boolean | "nocursor" | undefined;

   @Input()
   value: string = ""

   @Output()
   onEditorValueChanged = new EventEmitter<string>();

   // private _code: string;

   onTouched: () => void;
   onChanged: (v: any) => void;

   codeMirrorInstance: any;

   ngAfterViewInit(): void {
      this.codeMirrorInstance = CodeMirror.fromTextArea(
         this.editorHolder.nativeElement,
         {
            // value: this._code ? this._code : "",
            mode: {
               name: "javascript",
               jsonld: (this.mode === "json"),
               typescript: (this.mode === "typescript"),
               statementIndent: true
            },
            lineNumbers: this.lineNumbers,
            theme: 'darcula',
            readOnly: this.readonly,
            smartIndent: false,
            tabSize: 2,
         }
      );

      this.codeMirrorInstance.setValue(this.value)
      this.codeMirrorInstance.setSize("100%", "100%");

      this.codeMirrorInstance.on("change", (inst: any, obj: any) => {
         this.onEditorValueChanged.emit(inst.doc.getValue())
         // if (inst.doc.getValue() !== this._code) {
         //   this._code = inst.doc.getValue();
         //   if (this.onChanged) {
         //     this.onChanged(this._code);
         //   }
         // }
      });
   }

   ngOnChanges(changes: SimpleChanges) {
      if (this.codeMirrorInstance !== undefined) {
         this.writeValue(this.value);
         this.codeMirrorInstance.setOption("readOnly", this.readonly);
         this.codeMirrorInstance.refresh();
      }
   }

   writeValue(str: string): void {
      // if (str !== this._code) {
      //   this._code = str;
      //
      // get cursor position of old state
      const oldCursorPosition = this.codeMirrorInstance.getCursor();

      // write new value
      this.codeMirrorInstance.setValue(str);

      // set cursor to old position
      this.codeMirrorInstance.setCursor(oldCursorPosition);
      // }
   }

   setDisabledState(isDisabled: boolean): void {
      this.readonly = isDisabled;
      this.codeMirrorInstance.optio;
   }

   registerOnTouched(fn: any): void {
      this.onTouched = fn;
   }

   registerOnChange(fn: any): void {

      this.onChanged = fn;
   }
}
