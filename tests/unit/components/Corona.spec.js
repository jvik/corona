import { createLocalVue, shallowMount } from '@vue/test-utils'
import Corona from '@/components/Corona.vue'
import Vuetify from 'vuetify'
import Vue from 'vue'

Vue.use(Vuetify)

const msg = 'Hello world'
const localVue = createLocalVue()
localVue.use(Vuetify)

describe('Corona.vue', () => {
  const wrapper = shallowMount(Corona, {
    localVue,
    propsData: {
      msg,
    },
  })

  it('renders a vue instance', () => {
    expect(shallowMount(Corona, localVue).isVueInstance()).toBe(true)
  })

  it('renders props.msg when passed', () => {
    expect(wrapper.text()).toMatch(msg)
  })
})
