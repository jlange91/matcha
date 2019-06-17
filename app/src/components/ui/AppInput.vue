<template>
  <div>
    <label
      class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
      :for="name"
    >
        <slot />
    </label>
    <input
      :class="[error ? 'bg-white border-red-500' : 'border-teal-200', disabled ? 'bg-grey-300' : 'bg-white']"
      class="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-teal-500"
      @input="$emit('input', $event.target.value)"
      :type="type"
      :name="name"
      :id="name"
      :value="value"
      :disabled="disabled"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      autocomplete="true">
    <p v-show="error" class="text-red-500 text-xs italic py-1"> {{ showMessage }} </p>
  </div>
</template>

<script>
export default {
  name: "AppInput",
  props: {
    type: {
      type: String,
      required: false,
      default: "text"
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    error: {
      type: Boolean,
      required: false,
      default: false
    },
    errorMessage: {
      type: String,
      required: true,
    }
  },
  computed: {
    showMessage() {
        if (this.errorMessage)
          return this.errorMessage
        return "Please fill out this field" 
    }
  }
};
</script>