<script setup lang="ts">
import { isCheckbox, deleteValues, isSelect } from "../../../utils/functions";
import { computed, type CSSProperties, type PropType, type Reactive, type Ref, ref, watch, watchEffect } from "vue";
import type { FormElementData } from "~/src/runtime/types";

const props = defineProps({
    styles: {
        type: Object as PropType<CSSProperties>,
        required: true
    },
    active: {
        type: Object as PropType<Reactive<FormElementData> | undefined>,
        required: false
    }
})

const required = computed({
    get: () => !!props.active?.rules?.find(r => r === 'required'),
    set: (val) => {
        if (!props.active) return console.log("Huuuuhh!!!????")
        if (val) {
            if (!props.active?.rules) props.active.rules = []
            props.active.rules.push("required")
        } else {
            props.active.rules = props.active.rules?.filter(r => r !== "required")
        }
    }
})

const temp = ref("")
function addOption() {
    const datum = temp.value.trim()
    if (!datum) return
    props.active?.options.push({
        label: datum,
        value: datum
    })
    temp.value = ""
}
</script>

<template>
    <div class="properties" :style="styles">
        <h3 class="font-bold">Properties</h3>
        <div style="position: relative; display: flex; flex-direction: column; height: 98%;">
            <Transition name="fade">
                <TransitionGroup name="slide-fade" v-if="active" tag="div"
                    style="display: flex; flex-direction: column; height: 100%; position: absolute; width: 100%;">
                    <div :key="active.index">
                        <ul style="margin-top: 1rem;">
                            <h4 style="margin-bottom: 8px;">Meta</h4>
                            <li>
                                <label style="font-size: medium; margin-bottom: 0.4rem;">
                                    <p>Label</p>
                                    <input v-model="active.label" class="input">
                                </label>
                            </li>
                            <li>
                                <FormElementsInputSwitch :checked="required" class="switch-container"
                                    @change="required = $event">
                                    <p>Required</p>
                                </FormElementsInputSwitch>
                            </li>
                            <li v-if="isCheckbox(active)">
                                <FormElementsInputSwitch class="switch-container" :checked="active.multiple"
                                    @change="active.multiple = $event"
                                    @click="active.multiple && deleteValues(active.value || {})">
                                    <p>Multiple</p>
                                </FormElementsInputSwitch>
                            </li>
                        </ul>
                        <hr>
                        <ul v-if="isCheckbox(active) || isSelect(active)">
                            <li class="unset options">
                                <h4>Options</h4>
                                <ul style="margin-top: -5px;">
                                    <li v-for="item of active.options" class="unset item">
                                        <div style="
                                        max-width: 200px;
                                        overflow: hidden;
                                        margin-right: 10px;
                                        text-overflow: ellipsis;
                                         text-wrap: nowrap;">{{ item.label }}</div>
                                        <div class="delete"
                                            @click="active.options = active.options?.filter(i => i.value !== item.value)">
                                            Remove</div>
                                    </li>
                                    <li class="unset">
                                        <input type="text" class="input" style="width: 150px; margin-left: -10px;"
                                            @keydown.enter="addOption" placeholder="Type an option here" v-model="temp">
                                        <span class="add" @click="addOption">Add</span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div style="margin-top: auto; margin-bottom: 1rem; display: flex; gap: 0.25rem; padding: 1rem;"
                        key="footer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            style="width: 15px;">
                            <path
                                d="M12 22C6.47715 22 2 17.5228 2 12 2 6.47715 6.47715 2 12 2 17.5228 2 22 6.47715 22 12 22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12 20 7.58172 16.4183 4 12 4 7.58172 4 4 7.58172 4 12 4 16.4183 7.58172 20 12 20ZM13 10.5V15H14V17H10V15H11V12.5H10V10.5H13ZM13.5 8C13.5 8.82843 12.8284 9.5 12 9.5 11.1716 9.5 10.5 8.82843 10.5 8 10.5 7.17157 11.1716 6.5 12 6.5 12.8284 6.5 13.5 7.17157 13.5 8Z">
                            </path>
                        </svg>
                        Press the <code style="all:unset; font-family: monospace; margin-top: 0.1ch; display: inline;">Escape</code> key to deselect
                    </div>
                </TransitionGroup>
                <div v-else style="padding: 1rem;">
                    <p style="display: flex; gap: 0.5rem;">
                        <svg viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 40px;">
                            <path
                                d="M11.3788 4.88211L7.39239 0.963708C7.21053 0.784951 6.89635 0.809354 6.69109 1.01818C5.66628 2.06079 5.57116 3.63639 6.47914 4.52887L7.00167 5.04248L1.63948 5.45895C1.22571 5.49109 0.826782 5.68211 0.516662 5.99762C0.206541 6.31312 0.0224166 6.71528 -0.00259285 7.12955C-0.0517832 7.95591 0.624095 8.62323 1.45164 8.55895L2.70837 8.46134C2.63128 8.63995 2.58279 8.8303 2.57167 9.02615C2.54225 9.51343 2.74851 9.95865 3.11404 10.2168C2.93147 10.4777 2.81457 10.7837 2.79515 11.1053C2.75811 11.719 3.08232 12.2221 3.58546 12.4326C3.46251 12.6539 3.38547 12.9009 3.36929 13.1573C3.31775 14.0111 3.97074 14.6529 4.82352 14.5867L6.99757 14.4178C8.443 14.3049 9.83398 13.637 10.9168 12.5354C13.1516 10.2618 13.3589 6.82835 11.3788 4.88211ZM7.03417 2.0992L10.6351 5.63872C12.2521 7.2281 12.0829 10.031 10.2579 11.8878C9.37437 12.7866 8.23785 13.3326 7.05965 13.4241L4.88561 13.593C4.57843 13.6168 4.34452 13.3869 4.36309 13.0794C4.38165 12.7719 4.64566 12.5033 4.95284 12.4794C5.09029 12.4687 5.21711 12.403 5.3123 12.3061C5.4075 12.2093 5.4704 12.0807 5.47937 11.9437C5.4959 11.6699 5.28703 11.4646 5.01352 11.4858L4.31221 11.5403C4.00504 11.5641 3.77112 11.3342 3.78969 11.0267C3.79868 10.8778 3.86532 10.7336 3.97613 10.6209C4.08694 10.5081 4.23076 10.4382 4.3787 10.4275L5.08 10.373C5.21605 10.3624 5.34354 10.2973 5.43873 10.2005C5.53392 10.1036 5.59683 9.97503 5.60579 9.83806C5.62233 9.56422 5.41345 9.35891 5.13994 9.38016L4.08798 9.46186C3.79063 9.48496 3.54749 9.24597 3.56546 8.94826C3.57445 8.79941 3.64109 8.65516 3.7519 8.54242C3.86271 8.42969 4.00653 8.35982 4.15447 8.34903L5.90773 8.21285C6.04453 8.20153 6.17201 8.13642 6.2672 8.03957C6.36239 7.94272 6.4253 7.81414 6.43427 7.67717C6.4508 7.40334 6.24192 7.19803 5.96841 7.21927L1.51232 7.56537C1.21496 7.58847 0.972567 7.34872 0.989796 7.05177C0.998782 6.90292 1.06477 6.75802 1.17558 6.64529C1.28639 6.53255 1.43087 6.46333 1.5788 6.45253L8.13741 5.94313C8.33798 5.92755 8.52621 5.79273 8.61389 5.60073C8.70222 5.40937 8.67237 5.19854 8.53927 5.06771L7.22143 3.77237C6.79322 3.34998 6.73773 2.67362 7.03417 2.0992Z"
                                fill="white" />
                        </svg>
                        Select an item from the canvas to edit the metadata
                    </p>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
*,
*:before,
*:after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

ul,
ol {
    list-style: none;
}

a {
    text-decoration: none;
}

.properties {
    width: 100%;
    background-color: #323232;
    color: white;
    position: relative;
    overflow: hidden;
    height: 100%;

    --padding-x: 1rem;
    --green: rgb(6, 138, 76)
}

.properties h4 {
    font-size: 16px;
}

.font-bold {
    font-weight: bold;
    font-size: larger;
    padding: 1rem 1rem 0;
}

.properties ul {
    padding: 0.8rem var(--padding-x) 0.5rem;
    border-radius: 2px;
    background-color: #262626;
}

.properties li {
    padding: 0.25rem 0;
    height: 40px;
    width: 100%;
}

.unset ul {
    width: calc(100% + (var(--padding-x) * 2));
    margin-left: calc(var(--padding-x) * -1);
}

.properties ul>li:not(.unset)>* {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
}

.input {
    width: 180px;
    padding: 8px 10px;
    background-color: #323232;
    border-radius: 6px;
    border: none;
    color: white;
    outline: none;
}

.properties li:not(.unset)>*:not(:has(>input)) {
    margin-top: 6px;
}

.input:focus {
    outline: 1px solid var(--green);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    position: absolute;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
    position: absolute;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    position: absolute;
}

.switch-container {
    flex-direction: row-reverse;
    justify-content: flex-end;
}

.options li {
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding-right: 1rem;
    padding-left: 1rem;
}

.options .item>div {
    margin-top: 7px;
}

.options .item:hover {
    background-color: #323232;
    border-radius: 5px;
}

.options .delete {
    cursor: pointer;
}

.options .delete:hover {
    color: red;
}

.options .add {
    margin-top: 5px;
    cursor: pointer;
}

.options .add:hover {
    color: var(--green);
}

hr {
    opacity: 0;
}
</style>
