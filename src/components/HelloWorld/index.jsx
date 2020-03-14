import React, {Fragment} from 'react'
import { useBranch } from 'baobab-react/hooks'
import PropTypes from 'prop-types'


import syles from "./styles.css"

export default function HelloWorld() {
    const { name, dispatch } = useBranch({
        name: "name"
    })
    
    return <Fragment>
        <div>Hello, {name}!</div>
        <input type="text" value={name} onChange={e => dispatch(tree => tree.select('name').set(e.target.value))} />
    </Fragment>
}

HelloWorld.propTypes = {

}
