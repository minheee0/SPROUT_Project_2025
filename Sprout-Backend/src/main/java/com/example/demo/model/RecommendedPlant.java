package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "recommended_plants") // ✅ 새로운 테이블에 매핑
@Getter
@Setter
@NoArgsConstructor
public class RecommendedPlant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // 순환 참조 방지를 위해 무시
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT", nullable = false) // ✅ 긴 URL 저장을 위한 TEXT 타입
    private String imageUrl;

    public RecommendedPlant(User user, String name, String imageUrl) {
        this.user = user;
        this.name = name;
        this.imageUrl = imageUrl;
    }

    // ✅✅ 수정된 부분: cntntsNo 필드 추가
    @Column(nullable = false)
    private String cntntsNo;

    // ✅✅ 수정된 부분: cntntsNo를 포함하는 생성자 추가
    public RecommendedPlant(User user, String name, String imageUrl, String cntntsNo) {
        this.user = user;
        this.name = name;
        this.imageUrl = imageUrl;
        this.cntntsNo = cntntsNo;
    }
}