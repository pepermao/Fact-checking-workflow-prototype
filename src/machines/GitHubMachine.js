import { assign, createMachine } from "xstate";

const createIssue = assign({
    issueName: (context, event) => event.issueName
});

const assignedDev = assign({
    devName: (context, event) => event.devName
})

const openPr = assign({prTitle: (context, event) => event.prTitle
})

const newCommit = assign({
    commitsCount: (context) => context.commitsCount + 1,
})

const requestedChanges = assign({
    changeRequested: (context, event) => event.changeRequested
})


export const GithubMachine = createMachine({
    initial: "idle",
    context: {
        issueName: '',
        devName:'',
        prTitle:'',
        commitsCount: 0,
        changeRequested:'',
        merged: false
    },
    states: {
        idle: {
            on: {
                CREATEISSUE: { 
                    target: "issueCreated",
                    actions: [createIssue]
                },
            },  
        },
        issueCreated: {
            on: {
                ASSIGNDEV: { 
                    target: "assigned",
                    actions: [assignedDev]
                }
            }
        },
        assigned: {
            on:{
                OPENPR: {
                    target:"inReview",
                    actions: [openPr, newCommit]
                }
            }
        },  
        inReview:{
            on:{
                REQUESTCHANGE: {
                    target: "inRevision",
                    actions: [requestedChanges]
                },
                APPROVEPR: {
                    target: 'closed',
                }
            }
        },
        inRevision: {
            on: {
                NEWCOMMIT: "inReview",
                actions: [newCommit],
            }
        },
        closed:{}
    },
    actions: {
        createIssue,
        assignedDev,
        openPr,
        newCommit,
        requestedChanges
    }
})