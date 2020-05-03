// import nggt from '../../../nggt/nggt.js'
import Layout from './layout.js'

const Header = (...e) => Layout.El('p', Layout.Bold(...e))

const Section = (...e) => Layout.El('section', ...e)
const SectionHeader = (...e) => Layout.El('header', Header(...e))

const Article = (...e) => Layout.El('article', ...e)

const Card = (...e) => Layout.El('aside', ...e)
const CardBody = (...e) => Layout.El('p', ...e)

const Button = (inner, fn) => Layout.BtnAuto([], inner, fn)

const Accordion = (summary, ...e) => Layout.El('details', 
  Layout.El('summary', summary),
  Layout.El('p', ...e)
)

export default {
  Header,

  Section,
  SectionHeader,

  Article,
  
  Card,
  CardBody,

  Button,

  Accordion
}
