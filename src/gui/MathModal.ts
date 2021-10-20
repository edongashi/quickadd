import {ButtonComponent, debounce, loadMathJax, Modal, TextAreaComponent} from "obsidian";
import QuickAdd from "../main";
import {LaTeXSuggester} from "./LaTeXSuggester";
import {LATEX_CURSOR_MOVE_HERE} from "../LaTeXSymbols";

export class MathModal extends Modal {
    public waitForClose: Promise<string>;

    private resolvePromise: (input: string) => void;
    private rejectPromise: (reason?: any) => void;
    private inputEl: HTMLTextAreaElement;
    private didSubmit: boolean = false;

    private keybindListener = (evt: KeyboardEvent) => {
        if (evt.ctrlKey && evt.key === "Enter") {
            this.submit();
        }

        if (evt.key === "Tab") {
            evt.preventDefault();
            this.cursorToGoTo();
        }
    }

    static Prompt(): Promise<string> {
        return new MathModal().waitForClose;
    }

    constructor() {
        super(QuickAdd.instance.app);

        this.display();
        this.open();

        this.waitForClose = new Promise<string>(
            (resolve, reject) => {
                this.resolvePromise = resolve;
                this.rejectPromise = reject;
            }
        );

        new LaTeXSuggester(this.inputEl);

        this.inputEl.focus();
        this.inputEl.select();
    }

    private display() {
        this.contentEl.empty();

        const mathDiv = this.contentEl.createDiv();
        mathDiv.className = "math math-block is-loaded";

        const tc = new TextAreaComponent(this.contentEl);
        tc.inputEl.style.width = "100%";
        tc.inputEl.style.height = "10rem";

        this.inputEl = tc.inputEl;

        tc.onChange(debounce(async value => await this.mathjaxLoop(mathDiv, value), 50));

        tc.inputEl.addEventListener('keydown', this.keybindListener);

        this.createButtonBar(this.contentEl.createDiv());
    }

    async onOpen() {
        super.onOpen();
        await loadMathJax();
    }

    private async mathjaxLoop(container: HTMLDivElement, value: string) {
        // @ts-ignore
        const html = await MathJax.tex2chtmlPromise(value);

        container.empty();
        container.append(html);

        // @ts-ignore
        MathJax.chtmlStylesheet(); // This fixes the math rendering. I have no idea why.)
    }

    private cursorToGoTo() {
        if (this.inputEl.value.contains(LATEX_CURSOR_MOVE_HERE)) {
            const cursorPos = this.inputEl.value.indexOf(LATEX_CURSOR_MOVE_HERE);
            this.inputEl.value = this.inputEl.value.replace(LATEX_CURSOR_MOVE_HERE, "");
            this.inputEl.setSelectionRange(cursorPos, cursorPos);
        }
    }

    private createButton(container: HTMLElement, text: string, callback: (evt: MouseEvent) => any) {
        const btn = new ButtonComponent(container);
        btn.setButtonText(text)
            .onClick(callback);

        return btn;
    }

    private createButtonBar(mainContentContainer: HTMLDivElement) {
        const buttonBarContainer: HTMLDivElement = mainContentContainer.createDiv();
        this.createButton(buttonBarContainer, "Ok", this.submitClickCallback)
            .setCta().buttonEl.style.marginRight = '0';
        this.createButton(buttonBarContainer, "Cancel", this.cancelClickCallback);

        buttonBarContainer.style.display = 'flex';
        buttonBarContainer.style.flexDirection = 'row-reverse';
        buttonBarContainer.style.justifyContent = 'flex-start';
        buttonBarContainer.style.marginTop = '1rem';
    }

    private submitClickCallback = (evt: MouseEvent) => this.submit();
    private cancelClickCallback = (evt: MouseEvent) => this.cancel();

    private removeInputListeners() {
        this.inputEl.removeEventListener('keydown', this.keybindListener);
    }

    private resolveInput() {
        if(!this.didSubmit) this.rejectPromise("No input given.");
        else this.resolvePromise(this.inputEl.value.replace("\n", "\\n"));
    }

    private submit() {
        this.didSubmit = true;
        this.close();
    }

    private cancel() {
        this.close();
    }

    onClose() {
        super.onClose();
        this.resolveInput();
        this.removeInputListeners();
    }
}