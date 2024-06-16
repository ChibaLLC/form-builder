<template>
    <li class="footer-list-item">
        <slot />
    </li>
</template>
<style scoped lang="scss">
.footer-list-item {
    padding: 5px;
    cursor: pointer;
    transition: all 0.15s;
    border-radius: 4px;
    color: #191919;

    &:hover {
        background-color: hsla(0, 0%, 15%, 0.8);
        color: white;
    }
}
</style>
