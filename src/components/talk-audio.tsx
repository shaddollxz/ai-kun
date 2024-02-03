import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TalkBubble } from './talk-bubble'
import { PauseCircle, PlayCircle, Volume, Volume1, Volume2, VolumeX } from 'lucide-react'
import clsx from 'clsx'

export function TalkAudio({
  src,
  className,
  ...bubbleProps
}: { src: string } & Omit<Parameters<typeof TalkBubble>[0], 'children'>) {
  const [audioEle, setAudioEle] = useState<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  function setAudioEleRef(el: HTMLAudioElement | null) {
    if (el) {
      el.addEventListener('loadeddata', () => {
        setAudioEle(el)
      })

      el.addEventListener('ended', () => {
        // 播放完成设置为开始
        setPlaying(false)
        el.currentTime = 0
      })
    }
  }

  const playAudio = useCallback(() => {
    if (playing) {
      setPlaying(false)
      audioEle?.pause()
    } else {
      setPlaying(true)
      audioEle?.play()
    }
  }, [playing, audioEle])

  return (
    <TalkBubble {...bubbleProps} className={clsx('cursor-pointer', className)}>
      <audio ref={setAudioEleRef} src={src} className="opacity-0" />
      <div className="flex justify-between w-[199px]" onClick={playAudio}>
        {playing ? <PlayingAudio /> : <VolumeX />}
        {playing ? <PauseCircle className="text-orange-400" /> : <PlayCircle className="text-orange-400" />}
      </div>
    </TalkBubble>
  )
}

function PlayingAudio() {
  const loopList = useRef([Volume, Volume1, Volume2])
  const [index, setIndex] = useState(0)

  const ShowComp = useMemo(() => loopList.current[index], [index])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((v) => {
        const newIndex = v + 1
        if (loopList.current[newIndex]) {
          return newIndex
        }
        return 0
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return <ShowComp />
}
