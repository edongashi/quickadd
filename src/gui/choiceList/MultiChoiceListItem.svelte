<script lang="ts">
    import ObsidianIcon from "../components/ObsidianIcon.svelte";
    import ChoiceList from "./ChoiceList.svelte";
    import type IMultiChoice from "../../types/choices/IMultiChoice";
    import RightButtons from "./ChoiceItemRightButtons.svelte";
    import {createEventDispatcher} from "svelte";
	import { Component, htmlToMarkdown, MarkdownRenderer } from "obsidian";

    export let choice: IMultiChoice;
    export let collapseId: string;
    export let dragDisabled: boolean;
    let showConfigureButton: boolean = true;

    const dispatcher = createEventDispatcher();

    function deleteChoice(e: any) {
        dispatcher('deleteChoice', {choice});
    }

    function configureChoice() {
        dispatcher('configureChoice', {choice});
    }

    function toggleCommandForChoice() {
        dispatcher('toggleCommand', {choice});
    }

    function duplicateChoice() {
        dispatcher('duplicateChoice', {choice});
    }

	const cmp = new Component();
	let nameElement: HTMLSpanElement;

	$: {
		if (nameElement) {
			nameElement.innerHTML = "";
			const nameHTML = htmlToMarkdown(choice.name);
			MarkdownRenderer.renderMarkdown(
				nameHTML,
				nameElement,
				"/",
				cmp
			);
		}
	}
</script>

<div>
    <div class="multiChoiceListItem">
        <div 
            role="button"
            tabindex="0"
            class="multiChoiceListItemName clickable" 
            on:click={() => choice.collapsed = !choice.collapsed}
            on:keypress={(e) => (e.key === 'Enter' || e.key === ' ') && (choice.collapsed = !choice.collapsed)}
        >
            <div style={`transform:rotate(${choice.collapsed ? -180 : 0}deg); transition: transform 0.2s ease-in-out; display: inline-flex;`}>
                <ObsidianIcon iconId="chevron-down" size={16} />
            </div>
            <span class="choiceListItemName" bind:this={nameElement}></span>
        </div>

        <RightButtons
            on:mousedown
            on:touchstart
            on:deleteChoice={deleteChoice}
            on:configureChoice={configureChoice}
            on:toggleCommand={toggleCommandForChoice}
            on:duplicateChoice={duplicateChoice}
            bind:showConfigureButton
            bind:dragDisabled
            bind:choiceName={choice.name}
            bind:commandEnabled={choice.command}
            showDuplicateButton={true}
        />
    </div>

    {#if !collapseId || (collapseId && choice.id !== collapseId)}
        {#if !choice.collapsed}
            <div class="nestedChoiceList">
                <ChoiceList
                        on:deleteChoice
                        on:configureChoice
                        on:toggleCommand
                        on:duplicateChoice
                        bind:multiChoice={choice}
                        bind:choices={choice.choices}
                />
            </div>
        {/if}
    {/if}
</div>

<style>
    .multiChoiceListItem {
        display: flex;
        font-size: 16px;
        align-items: center;
        margin: 12px 0 0 0;
    }

    .clickable:hover {
        cursor: pointer;
    }

    .multiChoiceListItemName {
        flex: 1 0 0;
        margin-left: 5px;
    }

    .nestedChoiceList {
        padding-left: 25px;
    }
</style>
