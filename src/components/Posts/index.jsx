import React, {Fragment, useEffect} from 'react'
import { useBranch } from 'baobab-react/hooks'
import {  } from 'lodash'
import { getPosts } from '../../api'

import syles from "./styles.css"

export default function Posts() {
    const { posts, dispatch } = useBranch({
        posts: "posts"
    })

    async function fetchPosts() {
        let newPosts = (await getPosts()).posts
        console.log(newPosts)
        dispatch(tree => tree.select('posts').set(newPosts))
    }
    if (!posts) fetchPosts()

    if (!posts) return <Fragment />

    return <Fragment>
        {posts.map(post => {
            return <div key={post.id}>
                <span>{post.title}</span>
                <p>{post.text}</p>
            </div>
        })}
    </Fragment>
}

