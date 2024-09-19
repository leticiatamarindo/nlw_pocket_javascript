const { select, input, checkbox } = require('@inquirer/prompts')
 
let mensagem = "Bem vindo ao App de Metas";

let meta = {
    value: "Tomar 2L de água por dia",
    checked: false,
}

let metas = [meta]


// async = assíncrona
const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:"})

    if(meta.length == 0) {
        mensagem = "A meta não pode ser vazia."
        return
    }

    metas.push(
        {value:meta, checked: false }
    )

    mensagem = "Meta cadastrada com sucesso!"
}

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => { // checa antes de resetar 
        m.checked = false
    })

    if(respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada!"
        return
    }
    
//forEach-> para cada
    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem = "Meta(s) marcada(s) como concluída(s)."
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        mensagem = "Não existem metas realizadas! "
        return
    }

    await select({
        message: "Total de Metas Realizadas: " + realizadas.length,
        choices: [...realizadas] //spread
    })

    console.log(realizadas)
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => { 
        return meta.checked != true // OU: return !meta.checked -> pega um booleano e inverte o valor
    })  

    if(abertas.length == 0) {
        mensagem = "Não existem metas abertas! "
        return
    }

    await select({
        message: "Total de Metas Abertas: " + abertas.length,
        choices: [...abertas]
    })

}

const deletarMetas = async () => {
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    }) 

    const ItensADeletar = await checkbox({
        message: "Selecione um item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })
    
    if(ItensADeletar.length == 0) {
        mensagem = "Nenhum item para deletar!"
        return
    }

    ItensADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value  != item
        })
    })

    mensagem = "Meta(s) deletada(s) com sucesso!"

}

//limpeza do menu e mostrar msgs correspondentes
const  mostrarMensagem = () => { 
    console.clear();

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {

    while(true){
        mostrarMensagem()
        
        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch(opcao) {
            case "cadastrar":
                await cadastrarMeta()
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                console.log("Até a próxima")
                return 
        }
    }
}

start()

