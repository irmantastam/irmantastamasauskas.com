<template>
  <div class="mode-toggle">
    <button
      class="mode-toggle-button"
      title="Dark mode toggle"
      @click="toggleDark()"
    >
      <div class="mode-toggle-circle">
        <div id="mode-toggle-symbol"></div>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  name: "ModeToggleComponent",
};
</script>

<script setup>
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark({ disableTransition: false });
const toggleDark = useToggle(isDark);
</script>

<style>
.mode-toggle {
  display: flex;
  margin: 20px;
  font-size: 12px;
  align-items: center;
  margin-left: auto;
}

.mode-toggle-button {
  position: relative;
  padding: 0;
  width: 44px;
  height: 24px;
  min-width: 36px;
  min-height: 20px;
  background-color: var(--background-color);
  border: 1px solid var(--secondary-color);
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  z-index: 2;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-touch-callout: none;
  appearance: none;
  transition:
    background-color 0.3s ease,
    border 0.3s ease;
}

.mode-toggle-button:hover {
  border-color: var(--main-color);
}

.mode-toggle-button * {
  box-sizing: content-box;
}

.mode-toggle-circle {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid transparent;
  box-shadow: inset 0 0 0 2px #a5abba;
  overflow: hidden;
  transition: transform 0.3s ease;
}

#mode-toggle-symbol {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
}

#mode-toggle-symbol::before {
  content: "";
  position: relative;
  width: 100%;
  height: 100%;
  left: 50%;
  float: left;
  background-color: #a5abba;
  transition:
    border-radius 0.3s ease,
    width 0.3s ease,
    height 0.3s ease,
    left 0.3s ease,
    transform 0.3s ease;
}

:root.dark .mode-toggle-circle {
  transform: translateX(17px);
}

:root.dark #mode-toggle-symbol::before {
  border-radius: 50%;
  width: 150%;
  height: 85%;
  left: 40%;
  transform: translate(-10%, -40%), rotate(-35deg);
}

@media (prefers-color-scheme: dark) {
  :root:not(.light) .mode-toggle-circle {
    transform: translateX(17px);
  }
}

@media (prefers-color-scheme: dark) {
  :root:not(.light) #mode-toggle-symbol::before {
    border-radius: 50%;
    width: 150%;
    height: 85%;
    left: 40%;
    transform: translate(-10%, -40%), rotate(-35deg);
  }
}
</style>
